import { notFound } from "next/navigation";

import { db } from "@/db";
import DesignConfigurator from "./DesignConfigurator";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const DesignPage = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: {
      id,
    },
  });

  if (!configuration) {
    return notFound();
  }

  const { imgUrl, width, height } = configuration;

  return (
    <DesignConfigurator
      configId={""}
      imgUrl={""}
      imageDimensions={{
        width: 0,
        height: 0,
      }}
    />
  );
};

export default DesignPage;
