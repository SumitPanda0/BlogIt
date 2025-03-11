# frozen_string_literal: true

desc "Sets up the project by running migration and populating sample data"
task setup: [:environment, "db:drop", "db:create", "db:migrate"] do
  unless Rails.env.production?
    Rake::Task["populate_with_sample_data"].invoke
  else
    puts "Skipping deleting and populating sample data in production"
  end
end

desc "Populates the database with sample data"
task populate_with_sample_data: [:environment] do
  if Rails.env.production?
    puts "Skipping populating sample data in production"
    return
  end

  begin
    puts "Seeding with sample data..."
    create_sample_data!
    puts "Sample data has been added successfully"
    puts "You can now login with either of these two accounts:"
    puts "1. oliver@example.com / welcome"
    puts "2. sam@example.com / welcome"
  rescue StandardError => e
    puts "Error: #{e.message}"
    puts "Sample data creation failed!"
  end
end

def create_sample_data!
  organization = create_organization!

  create_user!(name: "Oliver Smith", email: "oliver@example.com", organization: organization)
  create_user!(name: "Sam Johnson", email: "sam@example.com", organization: organization)
end

def create_organization!
  Organization.find_or_create_by!(name: "Sample Organization")
rescue ActiveRecord::RecordInvalid => e
  puts "Error creating organization: #{e.message}"
  Organization.first || raise("No organization exists and couldn't create one")
end

def create_user!(attributes)
  default_attributes = {
    password: "welcome",
    password_confirmation: "welcome"
  }

  User.create!(default_attributes.merge(attributes))
rescue ActiveRecord::RecordInvalid => e
  puts "Error creating user with email '#{attributes[:email]}': #{e.message}"
  if e.message.include?("Email has already been taken")
    User.find_by(email: attributes[:email]) || raise(e)
  else
    raise(e)
  end
end
