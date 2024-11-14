"use client";
import React from "react";
import featuresData from "./featuresData";
import SingleFeature from "./SingleFeature";
import SectionHeader from "../common/SectionHeader";

const Feature = () => {
  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section id="features" className="pb-20 pt-10 lg:py-25 lg:pt-13 xl:py-30 xl:pt-15">
        <div className="mx-auto max-w-c-1315 px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "HEAVY CONSTRUCT FEATURES",
              subtitle: "Core Features of Heavy Construct",
              description: "Heavy Construct is a construction management system that helps you manage your construction projects, procurement, and logistics. Here are some of the core features of Heavy Construct.",
            }}
          />
          {/* <!-- Section Title End --> */}

          <div className="mt-12 md:mt-4 grid grid-cols-1 sm:gap-2 gap-0 gap-y-10 mx-12 place-items-start md:place-items-center md:grid-cols-2 lg:mt-15 lg:grid-cols-3 ">

            {/* <!-- Features item Start --> */}

            {featuresData.map((feature, key) => (
              <SingleFeature feature={feature} key={key} />
            ))}
            {/* <!-- Features item End --> */}
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Feature;
