import { useState } from "react";

const tabs = [
  { id: "popular", label: "Already Subcribed" },
  { id: "diplomas", label: "Available" },
  { id: "certificates", label: "Top Certificates" },
  { id: "new", label: "New Courses" },
];

const coursesData = {
  popular: [
    {
      title: "Diploma in Accounting and Finance",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
    },
    {
      title: "Diploma in Business Management",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    },
    {
      title: "Diploma in Hotel Management",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    },
    {
      title: "Diploma in Customer Services",
      image: "https://images.unsplash.com/photo-1581090700227-4c4f50b64a3b",
    },
  ],
  diplomas: [
    {
      title: "Advanced Business Strategy",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
    },
    {
      title: "Digital Marketing Diploma",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    },
    {
      title: "Project Management Diploma",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    {
      title: "HR Management Diploma",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    },
  ],
  certificates: [
    {
      title: "Certificate in IT Support",
      image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f",
    },
    {
      title: "Certificate in Leadership",
      image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    },
    {
      title: "Certificate in Finance",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
    },
    {
      title: "Certificate in Sales",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    },
  ],
  new: [
    {
      title: "AI for Beginners",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
    {
      title: "Cybersecurity Essentials",
      image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87",
    },
    {
      title: "UX/UI Design Basics",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d",
    },
    {
      title: "Cloud Computing",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    },
  ],
};

export default function CourseDash() {
  const [activeTab, setActiveTab] = useState("popular");

  return (
    <section className="bg-[#0c1824] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl text-slate-300 font-semibold text-center mb-10">
          Premium Courses
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-10 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-2 cursor-pointer font-medium transition ${
                activeTab === tab.id
                  ? "text-slate-300"
                  : "text-gray-400 hover:text-rose-200/80"
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
        <div className="grid md:grid-cols-4 gap-8">
          {coursesData[activeTab].map((course, index) => (
            <div
              key={index}
              className="bg-white/80 shadow-sm hover:shadow-lg transition rounded-lg overflow-hidden"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="font-medium mb-6">{course.title}</h3>
                <button className="hover:bg-neutral-700 cursor-pointer bg-neutral-600 text-white px-6 py-2 rounded transition">
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}