import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function CoursesSection() {
  const [activeTab, setActiveTab] = useState("business");
  const { t } = useTranslation();

  const tabs = [
    { id: "software", label: t("courses.tabs.software") },
    { id: "business", label: t("courses.tabs.business") },
    { id: "law", label: t("courses.tabs.law") },
    { id: "management", label: t("courses.tabs.management") },
    { id: "entrepreneurship", label: t("courses.tabs.entrepreneurship") },
  ];

  const coursesData = {
    software: [
      { title: t("courses.software.0.title"), program: t("courses.software.0.program"), school: "UNZA", image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
      { title: t("courses.software.1.title"), program: t("courses.software.1.program"), school: "ZCAS", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
      { title: t("courses.software.2.title"), program: t("courses.software.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
      { title: t("courses.software.3.title"), program: t("courses.software.3.program"), school: "NIPA", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d" },
    ],
    business: [
      { title: t("courses.business.0.title"), program: t("courses.business.0.program"), school: "ZCAS", image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c" },
      { title: t("courses.business.1.title"), program: t("courses.business.1.program"), school: "UNZA", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f" },
      { title: t("courses.business.2.title"), program: t("courses.business.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
      { title: t("courses.business.3.title"), program: t("courses.business.3.program"), school: "NIPA", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
    ],
    law: [
      { title: t("courses.law.0.title"), program: t("courses.law.0.program"), school: "UNZA", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7" },
      { title: t("courses.law.1.title"), program: t("courses.law.1.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85" },
      { title: t("courses.law.2.title"), program: t("courses.law.2.program"), school: "ZCAS", image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87" },
      { title: t("courses.law.3.title"), program: t("courses.law.3.program"), school: "NIPA", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf" },
    ],
    management: [
      { title: t("courses.management.0.title"), program: t("courses.management.0.program"), school: "UNZA", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c" },
      { title: t("courses.management.1.title"), program: t("courses.management.1.program"), school: "ZCAS", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d" },
      { title: t("courses.management.2.title"), program: t("courses.management.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1559028012-481c04fa702d" },
      { title: t("courses.management.3.title"), program: t("courses.management.3.program"), school: "NIPA", image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    ],
    entrepreneurship: [
      { title: t("courses.entrepreneurship.0.title"), program: t("courses.entrepreneurship.0.program"), school: "UNZA", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d" },
      { title: t("courses.entrepreneurship.1.title"), program: t("courses.entrepreneurship.1.program"), school: "ZCAS", image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
      { title: t("courses.entrepreneurship.2.title"), program: t("courses.entrepreneurship.2.program"), school: "UNILUS", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d" },
      { title: t("courses.entrepreneurship.3.title"), program: t("courses.entrepreneurship.3.program"), school: "NIPA", image: "https://images.unsplash.com/photo-1552664730-d307ca884978" },
    ],
  };

  return (
    <section className="bg-gray-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 className="text-3xl font-semibold text-slate-800 text-center mb-10">
          {t("courses.title")}
        </h2>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-6 md:gap-10 mb-8 md:mb-12 justify-center scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 pb-2 font-medium transition ${
                activeTab === tab.id
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute left-0 bottom-0 w-full h-1 bg-neutral-400 rounded"></span>
              )}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {coursesData[activeTab].map((course, index) => (
            <div
              key={index}
              className="bg-white shadow-sm hover:shadow-lg transition rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-4 md:p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-medium text-lg mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {course.school}
                  </p>
                  <p className="text-xs text-gray-400 mb-4">
                    {course.program}
                  </p>
                </div>

                <button className="mt-auto bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded transition text-sm md:text-base">
                  {t("courses.viewDetail")}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}