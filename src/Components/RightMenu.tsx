import { motion } from 'framer-motion';
import { ChangeEvent, useState } from 'react';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

interface RightMenuProps {
  fullScreen: () => void;
  removeBTN: () => void;
  saveOrUpdate: () => void;
  isUpdate: boolean;
  loading: boolean;
}

const RightMenu = ({ fullScreen, removeBTN, saveOrUpdate, isUpdate, loading }: RightMenuProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const url = isSignUp ? `${process.env.NEXT_PUBLIC_API}/auth/register` : `${process.env.NEXT_PUBLIC_API}/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });
      const res = await response.json();
      if (res.success) {
        setSnack({ open: true, message: res.message, severity: 'success' });
        if (isSignUp) {
          setIsSignUp(false); // switch to login after register
        } else {
          setShowLogout(true);
          setShowForm(false);
        }
      } else {
        throw new Error(res.message || 'Something went wrong');
      }
    } catch (err: any) {
      setSnack({ open: true, message: err.message, severity: 'error' });
    } finally {
      setFormData({ username: '', password: '' });
    }
  };

  const logoutHandle = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setSnack({ open: true, message: data.message, severity: 'success' });
        setShowLogout(false);
      }
    } catch (err: any) {
      setSnack({ open: true, message: err.message, severity: 'error' });
    }
  };

  if (showForm) {
    return (
      <>
        <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
          <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>
        </Snackbar>
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
          <div className="bg-zinc-900 text-white p-8 rounded-xl shadow-2xl w-[90%] max-w-md">
            <div className="text-center">
              <p className='font-bold text-white text-2xl mb-1'>{isSignUp ? "Register" : "Login"}</p>
              <p className='text-white text-sm'>{isSignUp ? "Create an account" : "Use your account to login"}</p>
            </div>
            <div className="mt-6">
              <input type="text" name="username" placeholder="Username" className="w-full p-2 rounded bg-zinc-800 mb-3" value={formData.username} onChange={handleChanges} />
              <input type="password" name="password" placeholder="Password" className="w-full p-2 rounded bg-zinc-800 mb-3" value={formData.password} onChange={handleChanges} />
              <button className="w-full bg-zinc-200 text-black p-2 rounded mt-2" onClick={handleSubmit}>
                {isSignUp ? "Register" : "Login"}
              </button>
              <button className="w-full text-zinc-400 hover:text-white mt-4 text-sm" onClick={() => setShowForm(false)}>Cancel</button>
              <button onClick={() => setIsSignUp(!isSignUp)} className='text-zinc-600 justify-center items-center flex w-full mt-2 text-sm'>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.3 }}>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity} variant="filled">{snack.message}</Alert>
      </Snackbar>
      <div className='absolute right-2 w-[300px] h-[200px] bg-zinc-800 rounded-2xl p-4 z-50 shadow-lg text-white flex flex-col gap-1'>
        <button className='hover:bg-zinc-700 p-2 rounded flex justify-between items-center' onClick={fullScreen} disabled={loading}>
          Full Screen <span className='text-xs text-zinc-500 ml-2'>Ctrl+Shift+F</span>
        </button>
        <button className='hover:bg-zinc-700 p-2 rounded flex justify-between items-center' onClick={saveOrUpdate} disabled={loading}>
          {loading ? (
            <><CircularProgress size={18} sx={{ color: "#ccc" }} /> <span className="ml-2">Processing</span></>
          ) : (
            <>{isUpdate ? "Update" : "Save"} <span className='text-xs text-zinc-500 ml-2'>Ctrl+S</span></>
          )}
        </button>
        <button className='hover:bg-zinc-700 p-2 rounded flex justify-between items-center' onClick={removeBTN} disabled={loading}>
          Remove <span className='text-xs text-zinc-500 ml-2'>Delete</span>
        </button>
        <hr className='border-zinc-600' />
        {showLogout ? (
          <button className='hover:bg-zinc-700 p-2 rounded' onClick={logoutHandle}>Logout</button>
        ) : (
          <button className='hover:bg-zinc-700 p-2 rounded' onClick={() => setShowForm(true)}>Login</button>
        )}
      </div>
    </motion.div>
  );
};

export default RightMenu;
