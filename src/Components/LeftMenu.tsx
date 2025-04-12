import React from 'react';
import { motion } from 'framer-motion';

const LeftMenu = () => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -300 }}  // Initially hidden on the left
            animate={{ opacity: 1, x: 0 }}     // Animate to full visibility from the left
            exit={{ opacity: 0, x: -300 }}     // Animate it back to hidden to the left
            transition={{ duration: 0.3 }}     // Smooth transition
        >
            <div className='absolute left-2 w-[300px]  bg-zinc-800 rounded-2xl p-4 z-50 shadow-lg text-white flex flex-col gap-1'>
                <button className='hover:bg-zinc-700 p-2 text-2xl rounded flex justify-between items-center'>
                    Saved Files <span className='text-xs text-zinc-500 ml-2'>Ctrl+B</span>
                </button>
                <p className='hover:bg-zinc-700 p-2 bg-zinc-900 rounded flex justify-between items-center'>Java Roadmap</p>
                <p className='hover:bg-zinc-700 p-2 bg-zinc-900 rounded flex justify-between items-center'>Some KeyWords</p>
                <p className='hover:bg-zinc-700 p-2 bg-zinc-900 rounded flex justify-between items-center'>Intro</p>
                <hr className='border-zinc-600 ' />
                <button className='hover:bg-zinc-700 p-2 text-red rounded flex justify-start items-start'>
                    Delete
                </button>
            </div>
        </motion.div>
    );
};

export default LeftMenu;
