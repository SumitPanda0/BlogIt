import React, { useEffect, useState } from "react";

import { Button } from "@bigbinary/neetoui";
import FileSaver from "file-saver";

import postsApi from "apis/posts";

import createConsumer from "../../channels/consumer";
import { subscribeToReportDownloadChannel } from "../../channels/reportDownloadChannel";
import ProgressBar from "../../common/ProgressBar";

const DownloadReport = ({ postId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const consumer = createConsumer();

  const generatePdf = async () => {
    try {
      await postsApi.generatePdf(postId);
    } catch (error) {
      logger.error(error);
    }
  };

  const downloadPdf = async () => {
    setIsLoading(true);
    try {
      const { data } = await postsApi.download(postId);
      FileSaver.saveAs(data, "blogit_post_report.pdf");
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    subscribeToReportDownloadChannel({
      consumer,
      setMessage,
      setProgress,
      generatePdf,
    });

    return () => {
      consumer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
      setMessage("Report is ready to be downloaded");
    }
  }, [progress]);

  return (
    <div className="flex flex-col items-center justify-center gap-y-8">
      <div className="mb-4 w-full">
        <div className="mx-auto w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-800 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-2xl">
          <div className="space-y-2 p-6">
            <p className="text-xl font-semibold">{message}</p>
            <ProgressBar progress={progress} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-4">
        <Button label="Download" loading={isLoading} onClick={downloadPdf} />
        <p className="mb-2 text-sm text-gray-500">
          Report is being generated, please wait...
        </p>
      </div>
    </div>
  );
};

export default DownloadReport;
