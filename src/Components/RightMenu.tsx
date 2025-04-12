import React from 'react'
import { motion } from 'framer-motion'

const RightMenu = () => {
    return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}   >
            <div className='absolute  right-2 w-[300px] h-[200px] bg-zinc-800 rounded-2xl p-4 z-50 shadow-lg text-white flex flex-col gap-1'>
                <button className='hover:bg-zinc-700 p-2 rounded flex justify-between items-center'>Full Screen <span className='text-xs text-zinc-500 ml-2'>Ctrl+Shift+F</span></button>
                <button className='hover:bg-zinc-700 p-2 rounded flex justify-between items-center'>Light Mode <span className='text-xs text-zinc-500 ml-2'>Ctrl+Shift+M</span></button>
                <button className='hover:bg-zinc-700 p-2 rounded flex justify-between items-center'>Remove <span className='text-xs text-zinc-500 ml-2'>Delete</span></button>
                <hr className='border-zinc-600 ' />
                <button className='hover:bg-zinc-700 p-2 rounded flex justify-start items-start'>Sign In</button>
            </div>
        </motion.div>
    )
}

export default RightMenu;
