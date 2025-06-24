import { motion } from 'framer-motion';

interface LeftMenuProps {
  files: any[];
  fetchFileById: (id: number) => void;
  handleDeleteAll: () => void;
}

const LeftMenu = ({ files, fetchFileById, handleDeleteAll }: LeftMenuProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      transition={{ duration: 0.3 }}
    >
      <div className='absolute left-2 w-[300px] bg-zinc-900 border border-zinc-700 rounded-2xl p-4 z-50 shadow-2xl text-white flex flex-col gap-2'>
        <button className=' bg-white text-zinc-700 p-3 text-lg rounded-lg flex justify-between items-center transition-all'>
          Saved Files <span className='text-xs text-gray-400 ml-2'>Ctrl+M</span>
        </button>

        {files.length === 0 && (
          <p className='text-zinc-500 italic text-sm px-1'>No saved files</p>
        )}

        {files.map(file => (
          <p
            key={file.id}
            className='hover:bg-zinc-700 bg-zinc-800 p-2 rounded-md flex justify-between items-center transition-all duration-150 cursor-pointer'
            onClick={() => fetchFileById(file.id)}
          >
            {file.name || 'Untitled'}
          </p>
        ))}

        <hr className='border-zinc-600 my-2' />

        <button
          onClick={handleDeleteAll}
          className='hover:bg-red-600 bg-red-500 text-white p-2 rounded-md font-medium transition-all duration-150'
        >
          Delete All
        </button>
      </div>
    </motion.div>
  );
};

export default LeftMenu;
