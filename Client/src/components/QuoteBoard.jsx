import React from 'react'
import axios from "axios"
import { useState } from 'react'
import { useEffect } from 'react';

const QuoteBoard = () => {


  const [quotes, setQuotes] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);


  const fetch = async () => {
    const res = await axios.get("http://localhost:4000/api/quotes");
    setQuotes(res.data);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async () => {
    if (editingId) {
      await axios.put(`http://localhost:4000/api/quotes/${editingId}`, { text });
      setEditingId(null);
    } else {
      await axios.post("http://localhost:4000/api/quotes", { text });
    }

    setText("");
    fetch();
  }

  const handleEdit = (quote) => {
    setEditingId(quote._id);
    setText(quote.text);
  }

  const handledelete = async (id) => {
    await axios.delete(`http://localhost:4000/api/quotes/${id}`);
    fetch();
  }



  return (
    <div className='bg-[#ECEDB0] p-6 rounded shadow-lg max-w-screen-sm mx-auto w-full'>
      <h1 className='text-3xl font-bold mb-4 flex items-center justify-center gap-1'>📝QuoteBoard</h1>
      <div className='flex mb-4'>
        <input
        className='flex-1 border rounded px-3 py-2 mr-2'
        type="text"
        placeholder='Write your Quote'
        value={text}
        onChange={(e) => setText(e.target.value)}
        />
        <button
        onClick={handleSubmit}
          className='bg-violet-700 text-white px-4 py-2 rounded hover:bg-violet-600 hover:shadow-md cursor-pointer'>
            {editingId ? "Update" : "Add"}
        </button>
      </div>


      {quotes.map((quote) => (
        <div key={quote._id}
          className='bg-[#EAD8A4] flex justify-between items-center rounded mb-2 px-4 py-2'>
          <span>{quote.text}</span>
          <div className='space-x-2 '>
            <button
            onClick={() => handleEdit(quote)}
            className='bg-lime-400 text-white px-4 py-2 rounded hover:bg-lime-500 hover:shadow-md cursor-pointer'
            >
              Edit
            </button>
            <button
            onClick={() => handledelete(quote._id)}
            className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 hover:shadow-md cursor-pointer'
            >
              Delete
            </button>
          </div>
        </div>
      ))}


    </div>
  )
}

export default QuoteBoard
