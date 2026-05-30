import { useRef } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";

const videos = [
  { 
    title: "Two People Exchanging Saliva", 
    author: "The New Yorker", 
    views: "30.4K views", 
    time: "36:19", 
    img: "https://img.youtube.com/vi/YE7VzlLtp-4/hqdefault.jpg", 
    url: "https://www.youtube.com/watch?v=YE7VzlLtp-4" 
  },
  { 
    title: "HONEYMOON", 
    author: "Alki Papastathopoulos", 
    views: "39.6K views", 
    time: "25:11", 
    img: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", 
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
  },
  { 
    title: "Trails Will Blaze", 
    author: "NOMINT", 
    views: "94.7K views", 
    time: "00:45", 
    img: "https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg", 
    url: "https://www.youtube.com/watch?v=ScMzIvxBSi4" 
  },
  { 
    title: "Another Cool Video", 
    author: "Some Creator", 
    views: "12.3K views", 
    time: "05:20", 
    img: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg", 
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0" 
  },
  { 
    title: "Yet Another Video", 
    author: "Creator XYZ", 
    views: "56.1K views", 
    time: "12:10", 
    img: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg", 
    url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk" 
  },
  { 
    title: "Fun Clip", 
    author: "FunnyVideos", 
    views: "78.9K views", 
    time: "03:33", 
    img: "https://img.youtube.com/vi/OPf0YbXqDm0/hqdefault.jpg", 
    url: "https://www.youtube.com/watch?v=OPf0YbXqDm0" 
  },
];


export default function HorizontalFeed({ handleVideoClick, theme }) {
  const sliderRef = useRef(null);
  const scroll = (direction) => sliderRef.current.scrollBy({ left: direction === "left" ? -400 : 400, behavior: "smooth" });

  return (
    <section className="relative mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Remarkable creators. Daily inspiration.</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"><ChevronLeft size={18} /></button>
          <button onClick={() => scroll("right")} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2">
        {videos.map((video, i) => (
          <VideoCard key={i} {...video} premium={i < 2} handleVideoClick={handleVideoClick} />
        ))}
      </div>
    </section>
  );
}

const VideoCard = ({ img, title, author, views, time, premium, handleVideoClick }) => (
  <div
    onClick={() => !premium && handleVideoClick({ url: img, free: !premium })}
    className={`min-w-[280px] rounded-xl overflow-hidden bg-white transition shadow-sm
      ${premium ? "ring-1 ring-violet-500/30 cursor-not-allowed" : "hover:shadow-md cursor-pointer"}`}
  >
    <div className="relative">
      <img src={img} alt={title} className="h-40 w-full object-cover" />
      <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">{time}</span>
      {premium && (
        <>
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-violet-600 text-white text-[10px] px-2 py-1 rounded-full">
            <Lock size={12} /> PREMIUM
          </div>
          <div className="absolute inset-0 bg-black/20" />
        </>
      )}
    </div>
    <div className="p-3">
      <h4 className="text-sm font-medium line-clamp-2">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{author}</p>
      <p className="text-xs text-slate-400">{views}</p>
    </div>
  </div>
);
