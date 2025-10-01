import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// --- Icon Components ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const CheckCircleIcon = ({ completed }) => {
  if (completed) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-600 hover:text-gray-400">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const ProjectsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-2 opacity-70"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m9 18 6-6-6-6" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- New Intro Animation Component ---
const IntroAnimation = ({ onAnimationComplete }) => {
  const textToType = "PROJEX";
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    if (typedText.length < textToType.length) {
      const timeoutId = setTimeout(() => {
        setTypedText(textToType.slice(0, typedText.length + 1));
      }, 150);
      return () => clearTimeout(timeoutId);
    } else {
      // Wait a bit after typing finishes, then complete
      const timeoutId = setTimeout(() => {
        onAnimationComplete();
      }, 700);
      return () => clearTimeout(timeoutId);
    }
  }, [typedText, onAnimationComplete]);

  return (
    <motion.div
      className="bg-black min-h-screen flex justify-center items-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-white text-4xl md:text-6xl font-bold tracking-widest">
        {typedText}
        <span className="animate-pulse">|</span>
      </h1>
    </motion.div>
  );
};


// --- Reusable Components ---
const Sidebar = ({ isMobile, onClose }) => {
  const NavLinks = () => (
    <nav className="flex flex-col space-y-2">
      <a href="#" className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold" onClick={onClose}><DashboardIcon /> Dashboard</a>
      <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg" onClick={onClose}><ProjectsIcon /> Projects</a>
      <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg" onClick={onClose}><TaskIcon /> Task</a>
      <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg" onClick={onClose}><CalendarIcon /> Calendar</a>
      <a href="#" className="flex items-center px-4 py-3 hover:bg-gray-700 rounded-lg" onClick={onClose}><SettingsIcon /> Setting</a>
    </nav>
  );

  const Brand = () => (
    <div className="flex items-center mb-10">
      <div className="w-10 h-10 bg-purple-600 rounded-lg mr-3 flex items-center justify-center font-bold text-white text-xl">P</div>
      <span className="text-xl font-bold">Projex</span>
    </div>
  );

  if (isMobile) {
    return (
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-full bg-[#1a1d2d] text-gray-300 w-64 p-6 flex flex-col z-50"
      >
        <div className="flex justify-between items-center mb-10">
          <Brand />
          <button onClick={onClose}><CloseIcon /></button>
        </div>
        <NavLinks />
      </motion.aside>
    );
  }

  return (
    <aside className="bg-[#1a1d2d] text-gray-300 w-64 p-6 flex-col justify-between hidden md:flex">
      <div>
        <Brand />
        <NavLinks />
      </div>
    </aside>
  );
};

const Header = ({ searchQuery, onSearchChange, onMenuClick }) => (
  <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
    <div className="flex items-center">
      <button className="md:hidden mr-4" onClick={onMenuClick}>
        <MenuIcon />
      </button>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Hello, Abhinav!</h1>
        <p className="text-gray-400 text-sm md:text-base">Let's Organize Your Daily Tasks.</p>
      </div>
    </div>
    <div className="flex items-center space-x-2 md:space-x-6 w-full md:w-auto">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search"
          className="bg-[#2c3143] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none w-full"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon /></div>
      </div>
      <button className="hidden sm:block"><BellIcon /></button>
      <div className="hidden sm:flex items-center">
        <img src="https://placehold.co/40x40/7e22ce/ffffff?text=A" alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-white">Abhinav</p>
          <p className="text-sm text-gray-400">MERN Stack Developer</p>
        </div>
      </div>
    </div>
  </header>
);

const ProjectCard = ({ project, color, onEdit, onDelete, onView }) => {
  const { title, description, deadline } = project;
  const getConsistentNumber = (id) => {
    if (!id) return 60;
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return Math.abs(hash);
  };
  const percentage = (getConsistentNumber(project._id) % 31) + 60;

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${color.from} ${color.to} text-white flex flex-col justify-between`}>
      <div onClick={() => onView(project)} className="cursor-pointer">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm opacity-80 mt-1 mb-4 h-10">{description.substring(0, 50)}...</p>
        {deadline && (
          <p className="text-xs font-semibold opacity-90 mb-4">
            Deadline: {new Date(deadline).toLocaleDateString()}
          </p>
        )}
        <div className="flex items-center justify-end"><div className="text-right"><p className="font-semibold">{percentage}%</p></div></div>
        <div className="w-full bg-black/30 rounded-full h-2.5 mt-2"><div className={`${color.bg} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        <button onClick={() => onEdit(project)} className="p-2 rounded-full hover:bg-black/20 transition-colors"><EditIcon /></button>
        <button onClick={() => onDelete(project._id)} className="p-2 rounded-full hover:bg-black/20 transition-colors"><TrashIcon /></button>
      </div>
    </div>
  );
};


const TaskItem = ({ task, onToggle, onDelete }) => (
  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
    <div className="flex items-center">
      <button onClick={() => onToggle(task._id, !task.isCompleted)} className="mr-4"><CheckCircleIcon completed={task.isCompleted} /></button>
      <span className={`text-white ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</span>
      <button onClick={() => onDelete(task._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><TrashIcon /></button>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-[#2c3143] rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ProjectDetailView = ({ project, onBack }) => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-[#1a1d2d] p-6 md:p-8 rounded-2xl"
  >
    <button onClick={onBack} className="flex items-center text-sm text-purple-400 hover:text-purple-300 mb-6 font-semibold">
      <ArrowLeftIcon />
      Back to Dashboard
    </button>
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h2>
    {project.deadline && (
      <p className="text-sm text-gray-400 mb-6">
        Deadline: {new Date(project.deadline).toLocaleDateString()}
      </p>
    )}
    <div className="prose prose-invert max-w-none text-gray-300 mb-6">
      <p>{project.description}</p>
    </div>

    <div className="mb-6">
      <h3 className="font-semibold text-lg text-white mb-3">Tech Stack</h3>
      <div className="flex flex-wrap gap-2">
        {project.techStack?.map(tech => (
          <span key={tech} className="bg-purple-500/20 text-purple-300 text-xs font-medium px-3 py-1 rounded-full">{tech}</span>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold text-lg text-white mb-3">Resources</h3>
      <div className="space-y-2">
        {project.resources?.map(link => (
          <a href={link} target="_blank" rel="noopener noreferrer" key={link} className="flex items-center text-blue-400 hover:text-blue-300 break-all">
            {link}
            <ExternalLinkIcon />
          </a>
        ))}
      </div>
    </div>
  </motion.section>
);

const SimpleCircularProgressBar = ({ percentage }) => {
  const sqSize = 150;
  const strokeWidth = 12;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const circumference = radius * Math.PI * 2;
  const dashOffset = circumference - (circumference * percentage) / 100;

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox}>
      <circle
        className="fill-none"
        stroke="rgba(255, 255, 255, 0.2)"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`} />
      <motion.circle
        className="fill-none"
        stroke="#a855f7"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: circumference,
          strokeLinecap: 'round',
        }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <text
        className="fill-white font-bold"
        fontSize="30px"
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle">
        {`${percentage}%`}
      </text>
    </svg>
  );
};

const TaskActivityChart = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <SimpleCircularProgressBar percentage={percentage} />
      <p className="text-white font-semibold mt-4">Tasks Completed</p>
      <p className="text-sm text-gray-400">{completedTasks} of {totalTasks} tasks done</p>
    </div>
  );
};

const MySchedule = ({ projects }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  const changeMonth = (offset) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const scheduledItems = projects
    .filter(p => p.deadline)
    .map(p => ({ ...p, date: new Date(p.deadline) }))
    .sort((a, b) => a.date - b.date);

  const groupedItems = scheduledItems.reduce((acc, item) => {
    const itemDate = item.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    if (!acc[itemDate]) {
      acc[itemDate] = [];
    }
    acc[itemDate].push(item);
    return acc;
  }, {});


  return (
    <div className="h-full flex flex-col">
      <h2 className="font-bold text-white text-xl mb-4">My Schedule</h2>
      <div className="bg-[#2c3143] p-4 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="text-gray-400 hover:text-white"><ChevronLeftIcon /></button>
          <h3 className="font-semibold text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button onClick={() => changeMonth(1)} className="text-gray-400 hover:text-white"><ChevronRightIcon /></button>
        </div>
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-gray-400">
          {daysOfWeek.map(day => <div key={day}>{day}</div>)}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const dayNumber = day + 1;
            const isToday = dayNumber === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            return <div key={dayNumber} className={`py-1 rounded-full ${isToday ? 'bg-purple-600 text-white' : 'hover:bg-gray-700'}`}>{dayNumber}</div>
          })}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedItems).map(([date, items]) => (
          <div key={date} className="mb-4">
            <p className="font-semibold text-sm text-gray-400 mb-2">{date}</p>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item._id} className="bg-[#2c3143] p-3 rounded-lg flex items-center">
                  <div className="w-1 h-10 bg-pink-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-400">Deadline</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  // Data state
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Intro state
  const [showIntro, setShowIntro] = useState(true);

  // UI State
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'projectDetail'
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [taskFilter, setTaskFilter] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalType, setModalType] = useState('project');
  const [currentItem, setCurrentItem] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [resources, setResources] = useState('');
  const [deadline, setDeadline] = useState('');

  const projectCardColors = [{ bg: 'bg-purple-500', from: 'from-purple-500', to: 'to-purple-800' }, { bg: 'bg-pink-500', from: 'from-pink-500', to: 'to-pink-800' }, { bg: 'bg-orange-500', from: 'from-orange-500', to: 'to-orange-800' },];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectsResponse, tasksResponse] = await Promise.all([axios.get('http://localhost:5001/projects'), axios.get('http://localhost:5001/tasks')]);
      setProjects(projectsResponse.data);
      setTasks(tasksResponse.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setCurrentItem(item);
    if (mode === 'edit' && item) {
      setTitle(item.title);
      setDescription(item.description || '');
      setTechStack(item.techStack ? item.techStack.join(', ') : '');
      setResources(item.resources ? item.resources.join(', ') : '');
      setDeadline(item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setTechStack('');
      setResources('');
      setDeadline('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'project') {
        const projectData = { title, description, techStack, resources, deadline };
        if (modalMode === 'add') {
          await axios.post('http://localhost:5001/projects/add', projectData);
        } else {
          await axios.post(`http://localhost:5001/projects/update/${currentItem._id}`, projectData);
        }
      } else {
        const taskData = { title };
        if (modalMode === 'add') {
          await axios.post('http://localhost:5001/tasks/add', taskData);
        }
      }
      fetchData();
      closeModal();
    } catch (err) {
      console.error(`Error saving ${modalType}:`, err);
      setError(`Failed to save ${modalType}.`);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`http://localhost:5001/projects/${id}`);
        fetchData();
      } catch (err) {
        console.error("Error deleting project:", err);
        setError("Failed to delete project.");
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/tasks/${id}`);
      fetchData();
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
    }
  };

  const handleToggleTask = async (id, isCompleted) => {
    try {
      await axios.post(`http://localhost:5001/tasks/update/${id}`, { isCompleted });
      fetchData();
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task status.");
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setView('projectDetail');
  };

  const DashboardView = () => {
    const filteredProjects = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (sortOrder === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0; // default order
    });

    const searchedTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTasks = searchedTasks.filter(task => {
      if (taskFilter === 'all') return true;
      if (taskFilter === 'completed') return task.isCompleted;
      if (taskFilter === 'pending') return !task.isCompleted;
      return true;
    });


    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">My Projects</h2>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#2c3143] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="default">Sort by Default</option>
              <option value="deadline">Sort by Deadline</option>
            </select>
          </div>
          <button onClick={() => openModal('project', 'add')} className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors self-end md:self-center"><PlusIcon /></button>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {loading && <p>Loading projects...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && sortedProjects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} color={projectCardColors[index % projectCardColors.length]} onEdit={openModal.bind(null, 'project', 'edit')} onDelete={handleDeleteProject} onView={handleViewProject} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1 bg-[#1a1d2d] p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold text-white">Today's Tasks</h2>
              <div className="flex items-center space-x-2 self-start sm:self-center">
                <button onClick={() => setTaskFilter('all')} className={`px-3 py-1 text-xs rounded-full ${taskFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-[#2c3143] text-gray-400'}`}>All</button>
                <button onClick={() => setTaskFilter('pending')} className={`px-3 py-1 text-xs rounded-full ${taskFilter === 'pending' ? 'bg-purple-600 text-white' : 'bg-[#2c3143] text-gray-400'}`}>Pending</button>
                <button onClick={() => setTaskFilter('completed')} className={`px-3 py-1 text-xs rounded-full ${taskFilter === 'completed' ? 'bg-purple-600 text-white' : 'bg-[#2c3143] text-gray-400'}`}>Completed</button>
              </div>
              <button onClick={() => openModal('task', 'add')} className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors hidden sm:block"><PlusIcon /></button>
            </div>
            <div className="space-y-4">
              <AnimatePresence>
                {loading && <p>Loading tasks...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && filteredTasks.map(task => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TaskItem task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="lg:col-span-1 bg-[#1a1d2d] p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Task Activity</h2>
            <TaskActivityChart tasks={tasks} />
          </div>
        </section>
      </motion.div>
    );
  };

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <IntroAnimation key="intro" onAnimationComplete={() => setShowIntro(false)} />
      ) : (
        <motion.div
          key="app"
          className="bg-[#212534] min-h-screen flex text-gray-300 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {isMobileMenuOpen && <Sidebar isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />}
          </AnimatePresence>
          <Sidebar isMobile={false} />

          <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <Header
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
            <AnimatePresence mode="wait">
              {view === 'dashboard' ? <DashboardView key="dashboard" /> : <ProjectDetailView key="detail" project={selectedProject} onBack={() => setView('dashboard')} />}
            </AnimatePresence>
          </main>
          <aside className="w-80 bg-[#1a1d2d] p-6 hidden xl:block">
            <MySchedule projects={projects} />
          </aside>

          <AnimatePresence>
            {isModalOpen && (
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h2 className="text-2xl font-bold text-white mb-6">{modalMode === 'add' ? 'Add New' : 'Edit'} {modalType === 'project' ? 'Project' : 'Task'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#3c4153] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                  </div>

                  {modalType === 'project' && (
                    <>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-[#3c4153] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required></textarea>
                      </div>
                      <div>
                        <label htmlFor="techStack" className="block text-sm font-medium text-gray-400 mb-2">Tech Stack (comma-separated)</label>
                        <input type="text" id="techStack" value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="e.g. React, Node.js, MongoDB" className="w-full bg-[#3c4153] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <div>
                        <label htmlFor="resources" className="block text-sm font-medium text-gray-400 mb-2">Resources (comma-separated links)</label>
                        <textarea id="resources" value={resources} onChange={(e) => setResources(e.target.value)} rows="2" placeholder="e.g. https://react.dev, https://..." className="w-full bg-[#3c4153] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                      </div>
                      <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
                        <input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full bg-[#3c4153] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end space-x-4 pt-4">
                    <button type="button" onClick={closeModal} className="text-gray-400 hover:text-white transition-colors px-6 py-2 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity">Save</button>
                  </div>
                </form>
              </Modal>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

