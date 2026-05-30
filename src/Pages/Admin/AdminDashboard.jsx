import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import PinModal from "./components/PinModal";

import DashboardSection from "./sections/DashboardSection";
import ProgramsSection from "./sections/ProgramSection";
import CoursesSection from "./sections/CourseSection";
import ContentSection from "./sections/ContentSection";
import SettingsSection from "./sections/SettingsSection";
import toast from "react-hot-toast";
import useAdminPin from "./hooks/useAdminPin";

import { adminService } from "./services/adminService";

export default function AdminDashboard() {

  const [active, setActive] = useState("dashboard");

  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [programData, setProgramData] = useState({});
  const [courseData, setCourseData] = useState({});
  const [chapterData, setChapterData] = useState({});
  const [lessonData, setLessonData] = useState({});

  const {
    showPin,
    pin,
    setPin,
    loading,
    setLoading,
    openPin,
    closePin
  } = useAdminPin();

  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const programsRes =
        await adminService.getPrograms();

      const coursesRes =
        await adminService.getCourses();

      const chaptersRes =
        await adminService.getChapters();

      setPrograms(programsRes.data);
      setCourses(coursesRes.data);
      setChapters(chaptersRes.data);

    } catch (e) {
      console.log(e);
    }
  }

  async function createProgram() {

    try {
      await adminService.createProgram(programData);
      await loadData();
    } catch (e) {
      console.log(e);
      toast.error(e)
    }
  }

  function openCourseCreation() {
    setPendingAction("course");
    openPin();
  }

  async function confirmPinAction() {

    setLoading(true);

    try {

      if (pendingAction === "course") {
        await adminService.createCourse(
          courseData,
          pin
        );
      }

      await loadData();

      closePin();

    } catch (e) {
      console.log(e);
      toast.error(e  || 'failed to create a course')

    }

    setLoading(false);
  }

  async function createChapter() {

    try {

      await adminService.createChapter(
        chapterData.course_id,
        chapterData
      );

      await loadData();

    } catch (e) {
      console.log(e);
      toast.error(e)
    }
  }

  async function createLesson() {

    try {

      await adminService.createLesson(
        lessonData.chapter_id,
        lessonData
      );

      await loadData();

    } catch (e) {
      console.log(e);
      toast.error(e || 'Failed')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">

      <Sidebar
        active={active}
        setActive={setActive}
      />

      <main className="flex-1 md:ml-20 p-10 space-y-8">

        <h1 className="text-3xl font-bold capitalize">
          {active}
        </h1>

        {active === "dashboard" && (
          <DashboardSection />
        )}

        {active === "programs" && (
          <ProgramsSection
            setPrograms={setPrograms}
            onSubmit={createProgram}
          />
        )}

        {active === "courses" && (
          <CoursesSection
            setCourseData={setCourseData}
            onSubmit={openCourseCreation}
          />
        )}

        {active === "content" && (
          <ContentSection
            chapters={chapters}
            setChapterData={setChapterData}
            setLessonData={setLessonData}
            onAddChapter={createChapter}
            onAddLesson={createLesson}
          />
        )}
        {active === "settings" && (
           <SettingsSection />
        )}
      </main>

      <PinModal
        open={showPin}
        pin={pin}
        setPin={setPin}
        loading={loading}
        onConfirm={confirmPinAction}
        onClose={closePin}
      />

    </div>
  );
}