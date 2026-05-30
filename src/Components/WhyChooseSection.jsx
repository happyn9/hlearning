import { Tag, Globe, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function WhyChooseSection() {
  const { t } = useTranslation();

  const items = [
    {
      icon: Tag,
      titleKey: "why.items.free.title",
      descKey: "why.items.free.desc",
    },
    {
      icon: Globe,
      titleKey: "why.items.flexible.title",
      descKey: "why.items.flexible.desc",
    },
    {
      icon: Award,
      titleKey: "why.items.certificate.title",
      descKey: "why.items.certificate.desc",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-3xl text-slate-800 font-semibold mb-16">
          {t("why.title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div key={i}>
                <div className="flex justify-center mb-6">
                  <Icon className="w-16 h-16 text-neutral-400" />
                </div>

                <h3 className="font-semibold text-lg mb-4">
                  {t(item.titleKey)}
                </h3>

                <p className="text-gray-600">
                  {t(item.descKey)}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}