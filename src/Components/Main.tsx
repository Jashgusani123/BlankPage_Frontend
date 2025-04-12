"use client"
import React, { useState, useEffect, useRef } from 'react'
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { CgMenuRight } from "react-icons/cg";
import RightMenu from './RightMenu';
import LeftMenu from './LeftMenu';

const Main = () => {
    const [IsWords, setIsWords] = useState<boolean | null>(null);
    const [text, setText] = useState("");
    const [RightShowMenu, setRightShowMenu] = useState(false);
    const [LeftShowMenu, setLeftShowMenu] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null); // ✅ Ref for Right menu container
    const leftMenuRef = useRef<HTMLDivElement>(null); // ✅ Ref for Left menu container

    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const characterCount = text.length;
    const firstFourWords = text.trim().split(/\s+/).slice(0, 4).join(" ");

    useEffect(() => {
        setIsWords(true);
    }, []);

    useEffect(() => {
        if (text.trim() === "") {
            document.title = "Blank Page";
        } else {
            document.title = firstFourWords + " ...";
        }
    }, [text, firstFourWords]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    // ✅ Close Right Menu when clicking outside
    useEffect(() => {
        const handleClickOutsideRightMenu = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setRightShowMenu(false);
            }
        };

        if (RightShowMenu) {
            document.addEventListener("mousedown", handleClickOutsideRightMenu);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideRightMenu);
        };
    }, [RightShowMenu]);

    // ✅ Close Left Menu when clicking outside
    useEffect(() => {
        const handleClickOutsideLeftMenu = (event: MouseEvent) => {
            if (leftMenuRef.current && !leftMenuRef.current.contains(event.target as Node)) {
                setLeftShowMenu(false);
            }
        };

        if (LeftShowMenu) {
            document.addEventListener("mousedown", handleClickOutsideLeftMenu);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutsideLeftMenu);
        };
    }, [LeftShowMenu]);

    return (
        <div className='main_container relative h-auto w-full'>
            <nav className='flex flex-wrap w-full justify-between p-2'>
                {/* Left Sidebar Menu */}
                <div ref={menuRef} className='relative z-50'>
                    <TbLayoutSidebarLeftExpandFilled className='w-10 h-10 cursor-pointer z-50' onClick={() => setLeftShowMenu(prev => !prev)} />
                    {LeftShowMenu && (
                        <div ref={leftMenuRef} className='absolute left-0'>
                            <LeftMenu />
                        </div>
                    )}
                </div>

                <div className="left_options flex justify-around items-center w-52 relative">
                    <p
                        className='text-white font-bold bg-zinc-900 cursor-pointer rounded-xl p-2 min-w-[140px] text-center z-50'
                        onClick={() => setIsWords(!IsWords)}
                    >
                        {
                            IsWords === null
                                ? "Loading..."
                                : IsWords
                                    ? `${wordCount} Words`
                                    : `${characterCount} Characters`
                        }
                    </p>

                    {/* Right Sidebar Menu */}
                    <div ref={menuRef} className='relative z-50'>
                        <CgMenuRight
                            className='w-12 h-12 cursor-pointer'
                            onClick={() => setRightShowMenu(prev => !prev)}
                        />
                        {RightShowMenu && (
                            <div className='absolute right-0'>
                                <RightMenu />
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div
                className="Inner_main_container h-auto w-auto"
                style={{
                    scrollbarWidth: "thin",
                    scrollBehavior: "smooth",
                    scrollPaddingBottom: "0px",
                    opacity: 1,
                }}
            >
                <textarea
                    name="fileContent"
                    id="fileContent"
                    className="w-full resize-none outline-none placeholder:text-gray-200 dark:placeholder:text-gray-200/15 absolute left-0 top-0 h-full overflow-y-auto overflow-x-hidden break-words font-mono text-base leading-relaxed text-black caret-[rgb(71,135,238)] dark:text-[rgb(200,200,208)] md:text-lg md:leading-loose duration-500 transition-[background-color,opacity] bg-transparent z-30"
                    style={{
                        scrollbarWidth: "thin",
                        scrollBehavior: "smooth",
                        scrollPaddingBottom: "0px",
                        width: "100%",
                        padding: "calc(1em + 64px) max(-372px + 50vw, 1em) 5em",
                        height: "100vh",
                    }}
                    placeholder='Start Writing...'
                    onChange={handleChange}
                ></textarea>
            </div>
        </div>
    )
}

export default Main;
