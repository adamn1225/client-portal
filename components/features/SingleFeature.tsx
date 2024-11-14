import React from "react";
import { Feature } from "../../types/feature";
import Image from "next/image";
import { motion } from "framer-motion";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, description } = feature;

  return (
    <>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -10,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="z-40 rounded-lg border border-white bg-white p-2 transition-all dark:border-strokedark dark:bg-zinc-800 dark:hover:bg-hoverdark xl:p-3"
      >
        <div className="relative flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-[4px] bg-primary mb-2">
          <Image src={icon} width={36} height={36} alt="title" />
        </div>
        <h3 className=" md:text-xl text-nowrap font-semibold text-black dark:text-white">
          {title}
        </h3>
        <p>{description}</p>
      </motion.div>
    </>
  );
};

export default SingleFeature;
