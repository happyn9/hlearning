import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import PinModal from "./components/PinModal";

import DashboardSection from "./sections/DashboardSection";
import ProgramsSection from "./sections/ProgramSection";
import CoursesSection from "./sections/CourseSection";
import ContentSection from "./sections/ContentSection";
import SettingsSection from "./sections/SettingsSection";
import CenterSection from "./sections/CenterSection";
import TeacherSection from "./sections/TeacherSection";
import StudentSection from "./sections/StudentSection";
import NotificationSection from "./sections/NotificationSection";
import toast from "react-hot-toast";
import useAdminPin from "./hooks/useAdminPin";

import { adminService } from "./services/adminService";

export default function AdminDashboard() {

  const [active, setActive] = useState("dashboard");

  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [centers, setCenters] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [learners, setLearners] = useState([]);

  const [programData, setProgramData] = useState({});
  const [courseData, setCourseData] = useState({});
  const [chapterData, setChapterData] = useState({});
  const [lessonData, setLessonData] = useState({});

  const [dataLoading, setDataLoading] = useState(true);

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
    setDataLoading(true);
    try {
      const [
        programsRes,
        coursesRes,
        chaptersRes,
        centersRes,
        teachersRes,
        studentsRes,
        learnersRes,
      ] = await Promise.all([
        adminService.getPrograms(),
        adminService.getCourses(),
        adminService.getChapters(),
        adminService.getCenters(),
        adminService.getTeachers(),
        adminService.getStudents(),
        adminService.getLearners(),
      ]);

      setPrograms(Array.isArray(programsRes) ? programsRes : []);
      setCourses(Array.isArray(coursesRes) ? coursesRes : []);
      setChapters(Array.isArray(chaptersRes) ? chaptersRes : []);
      setCenters(Array.isArray(centersRes) ? centersRes : []);
      setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
      setStudents(Array.isArray(studentsRes) ? studentsRes : []);
      setLearners(Array.isArray(learnersRes) ? learnersRes : []);
    } catch (e) {
      console.log(e);
      toast.error(e?.message || "Erreur de chargement des données");
    } finally {
      setDataLoading(false);
    }
  }

  async function createProgram() {
    try {
      const res = await adminService.createProgram(programData);
      setPrograms(prev => [...prev, res]);
      toast.success("Programme créé avec succès");
    } catch (e) {
      console.log(e);
      toast.error(e?.message || "Échec de la création du programme");
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
        const res = await adminService.createCourse(courseData, pin);
        setCourses(prev => [...prev, res]);
      }
      closePin();
    } catch (e) {
      console.log(e);
      toast.error(e?.message || "Échec de la création du cours");
    }
    setLoading(false);
  }

  async function createChapter() {
    if (!chapterData.course_id || !chapterData.title) {
      return toast.error("Sélectionnez un cours et donnez un titre au chapitre");
    }

    try {
      const res = await adminService.createChapter(chapterData.course_id, chapterData);
      setChapters(prev => [...prev, res]);
      toast.success("Chapitre ajouté avec succès");
    } catch (e) {
      console.log(e);
      toast.error(e?.message || "Échec de la création du chapitre");
    }
  }

  async function createLesson() {
    if (!lessonData.chapter_id) {
      return toast.error("Sélectionnez un chapitre");
    }
    if (!lessonData.title) {
      return toast.error("Donnez un titre à la leçon");
    }
    if (!lessonData.type) {
      return toast.error("Choisissez un type de leçon (Vidéo ou PDF)");
    }

    try {
      await adminService.createLesson(lessonData.chapter_id, lessonData);
      toast.success("Leçon ajoutée avec succès");
    } catch (e) {
      console.log("ERROR =", e);
      toast.error(e?.message || "Échec de la création de la leçon");
    }
  }

  /* ================= TEACHER CRUD ================= */
  async function createTeacher(data) {
    const res = await adminService.createTeacher(data);
    setTeachers(prev => [...prev, res]);
    return res;
  }

  async function updateTeacher(teacherId, data) {
    const res = await adminService.updateTeacher(teacherId, data);
    setTeachers(prev => prev.map(t => (t.id === teacherId ? { ...t, ...res } : t)));
    return res;
  }

  async function deleteTeacher(teacherId) {
    await adminService.deleteTeacher(teacherId);
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  }

  /* ================= CENTER CRUD ================= */
  async function createCenter(data) {
    const res = await adminService.createCenter(data);
    setCenters(prev => [...prev, res]);
    return res;
  }

  async function updateCenter(centerId, data) {
    const res = await adminService.updateCenter(centerId, data);
    setCenters(prev => prev.map(c => (c.id === centerId ? { ...c, ...res } : c)));
    return res;
  }

  async function deleteCenter(centerId) {
    await adminService.deleteCenter(centerId);
    setCenters(prev => prev.filter(c => c.id !== centerId));
  }

  /* ================= STUDENT ================= */
  async function changeStudentCenter(studentId, centerId) {
    const res = await adminService.changeStudentCenter(studentId, centerId);
    setStudents(prev => prev.map(s => (s.id === studentId ? { ...s, ...res } : s)));
    return res;
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">

      <Sidebar
        active={active}
        setActive={setActive}
      />

      <main className="flex-1 md:ml-20 p-10 pb-28 md:pb-10 space-y-8">

        <h1 className="text-3xl font-bold capitalize">
          {active}
        </h1>

        {active === "dashboard" && (
          <DashboardSection
            courses={courses}
            learners={learners}
            chapters={chapters}
            loading={dataLoading}
          />
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

        {active === "centers" && (
          <CenterSection
            centers={centers}
            loading={dataLoading}
            onCreate={createCenter}
            onUpdate={updateCenter}
            onDelete={deleteCenter}
          />
        )}

        {active === "teachers" && (
          <TeacherSection
            teachers={teachers}
            loading={dataLoading}
            onCreate={createTeacher}
            onUpdate={updateTeacher}
            onDelete={deleteTeacher}
          />
        )}

        {active === "students" && (
          <StudentSection
            students={students}
            centers={centers}
            loading={dataLoading}
            onChangeCenter={changeStudentCenter}
          />
        )}

        {active === "notifications" && (
          <NotificationSection centers={centers} />
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