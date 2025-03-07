import React, { useState, useEffect } from "react";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import organizationsApi from "apis/organizations";
import SignupForm from "components/Authentication/Form/Signup";
import { setToLocalStorage } from "utils/storage";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingOrganizations, setFetchingOrganizations] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await organizationsApi.fetch();
        setOrganizations(response.data.organizations);
        if (response.data.organizations.length > 0) {
          setOrganizationId(response.data.organizations[0].id);
        }
      } catch (error) {
        logger.error(error);
      } finally {
        setFetchingOrganizations(false);
      }
    };
    fetchOrganizations();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await authApi.signup({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        organization_id: organizationId,
      });

      setToLocalStorage({
        authToken: response.data.authentication_token,
        email: email.toLowerCase(),
        userId: response.data.id,
        userName: name,
      });
      setAuthHeaders();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
      setLoading(false);
    }
  };

  return (
    <SignupForm
      handleSubmit={handleSubmit}
      loading={loading || fetchingOrganizations}
      organizationId={organizationId}
      organizations={organizations}
      setEmail={setEmail}
      setName={setName}
      setOrganizationId={setOrganizationId}
      setPassword={setPassword}
      setPasswordConfirmation={setPasswordConfirmation}
    />
  );
};

export default Signup;
