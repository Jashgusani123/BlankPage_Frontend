"use client"
import React, { useState, useEffect, useRef } from 'react'
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { CgMenuRight } from "react-icons/cg";
import RightMenu from './RightMenu';
import LeftMenu from './LeftMenu';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
// ✅ instead, define a type for the file
type UserFile = {
  id: number;
  name: string;
  content: string;
};
const Main = () => {
    const [text, setText] = useState("");
    const [rightShowMenu, setRightShowMenu] = useState(false);
    const [leftShowMenu, setLeftShowMenu] = useState(false);
    const [userFiles, setUserFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState<UserFile | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const leftMenuRef = useRef<HTMLDivElement>(null);
    const rightMenuRef = useRef<HTMLDivElement>(null);

    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const firstFourWords = text.trim().split(/\s+/).slice(0, 4).join(" ");

    const requestFullScreen = () => {
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) docElm.requestFullscreen();
    };

    const handleSaveOrUpdate = async () => {
        setLoading(true);
        try {
            const url = selectedFile
                ? `${API_BASE}/files/update/${selectedFile.id}`
                : `${API_BASE}/files/create`;
            const method = selectedFile ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: firstFourWords || "Untitled", content: text })
            });

            const res = await response.json();
            if (res.success) {
                setSnackbar({
                    open: true,
                    message: res.message || (selectedFile ? "File updated!" : "File saved!"),
                    severity: "success"
                });
                fetchFiles();
                if (!selectedFile && res.data) setSelectedFile(res.data);
            } else {
                throw new Error(res.message || "Save/Update failed");
            }
        } catch (err: any) {
            console.error(err);
            setSnackbar({ open: true, message: err.message, severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const fetchFiles = async () => {
        try {
            const res = await fetch(`${API_BASE}/files/get`, {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) setUserFiles(data.data);
        } catch (err) {
            console.error("Failed to fetch files", err);
        }
    };

    const fetchFileById = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE}/files/${id}`, {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setText(data.data.content);
                setSelectedFile(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch file by ID", err);
        }
    };

    useEffect(() => {
        const keyHandler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSaveOrUpdate();
            } else if (e.ctrlKey && e.key.toLowerCase() === "m") {
                setLeftShowMenu(true);
            } else if (e.ctrlKey && e.shiftKey && e.key === 'F') {
                requestFullScreen();
            }
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, [text, selectedFile]);

    useEffect(() => {
        document.title = text.trim() === "" ? "Blank Page" : firstFourWords + " ...";
    }, [text, firstFourWords]);

    useEffect(() => { fetchFiles(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value);
    const clearText = () => { setText(""); setSelectedFile(null); };

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (rightShowMenu && rightMenuRef.current && !rightMenuRef.current.contains(e.target as Node)) {
                setRightShowMenu(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [rightShowMenu]);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (leftShowMenu && leftMenuRef.current && !leftMenuRef.current.contains(e.target as Node)) {
                setLeftShowMenu(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [leftShowMenu]);

    const handleDeleteAll = async () => {
        const res = await fetch(`${API_BASE}/files/delete/all`, {
            method: "DELETE",
            credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
            setUserFiles([]);
            setText("");
            setSelectedFile(null);
            setSnackbar({ open: true, message: "All files deleted!", severity: "success" });
        }
    };

    return (
        <div className='main_container relative h-auto w-full'>
            <nav className='flex flex-wrap w-full justify-between p-2'>
                <div className='relative z-50'>
                    <TbLayoutSidebarLeftExpandFilled className='w-10 h-10 cursor-pointer z-50' onClick={() => setLeftShowMenu(prev => !prev)} />
                    {leftShowMenu && (
                        <div ref={leftMenuRef} className='absolute left-0'>
                            <LeftMenu files={userFiles} fetchFileById={fetchFileById} handleDeleteAll={handleDeleteAll} />
                        </div>
                    )}
                </div>
                <div className="left_options flex justify-around items-center w-52 relative">
                    <p className='text-white font-bold bg-zinc-900 cursor-pointer rounded-xl p-2 min-w-[140px] text-center z-50'>
                        {`${wordCount} Words`}
                    </p>
                    <div className='relative z-50'>
                        <CgMenuRight className='w-12 h-12 cursor-pointer' onClick={() => setRightShowMenu(prev => !prev)} />
                        {rightShowMenu && (
                            <div ref={rightMenuRef} className='absolute right-0'>
                                <RightMenu
                                    fullScreen={requestFullScreen}
                                    removeBTN={clearText}
                                    saveOrUpdate={handleSaveOrUpdate}
                                    isUpdate={!!selectedFile}
                                    loading={loading}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="Inner_main_container h-auto w-auto">
                <textarea
                    name="fileContent"
                    id="fileContent"
                    className="w-full resize-none outline-none placeholder:text-gray-200 dark:placeholder:text-gray-200/15 absolute left-0 top-0 h-full overflow-y-auto overflow-x-hidden break-words font-mono text-base leading-relaxed text-black caret-[rgb(238,71,71)] dark:text-[rgb(200,200,208)] md:text-lg md:leading-loose duration-500 transition-[background-color,opacity] bg-transparent z-30"
                    style={{
                        scrollbarWidth: "thin",
                        scrollBehavior: "smooth",
                        padding: "calc(1em + 64px) max(-372px + 50vw, 1em) 5em",
                        height: "100vh",
                    }}
                    placeholder='Start Writing...'
                    onChange={handleChange}
                    value={text}
                ></textarea>
            </div>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity as any} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Main;
