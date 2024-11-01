import React, { useEffect, useRef, useState } from 'react';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from '../config/firebase/firebaseconfig';

const Home = () => {
  const todoInput = useRef();
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);

  useEffect(() => {
    const getDataFromFirestore = async () => {
      if (user) {
        try {
          const q = query(collection(db, "todo"), where("uid", "==", user.uid));
          const querySnapshot = await getDocs(q);
          
          const todosArray = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            docid: doc.id
          }));

          setTodos(todosArray);
        } catch (error) {
          console.error("Error fetching todos: ", error);
        }
      }
    };

    getDataFromFirestore();
  }, [user]);

  const addOrUpdateTodo = async (event) => {
    event.preventDefault();
    const todoTitle = todoInput.current.value.trim();
    if (!todoTitle) return;

    if (isEditing) {
      try {
        const todoRef = doc(db, "todo", currentTodoId);
        await updateDoc(todoRef, { title: todoTitle });

        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.docid === currentTodoId ? { ...todo, title: todoTitle } : todo
          )
        );

        setIsEditing(false);
        setCurrentTodoId(null);
        todoInput.current.value = '';
      } catch (error) {
        console.error("Error updating todo: ", error);
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "todo"), {
          title: todoTitle,
          uid: user.uid
        });

        const newTodo = {
          title: todoTitle,
          uid: user.uid,
          docid: docRef.id
        };

        setTodos((prevTodos) => [...prevTodos, newTodo]);
        todoInput.current.value = '';
      } catch (error) {
        console.error("Error adding todo: ", error);
      }
    }
  };

  const editTodo = (id, title) => {
    setIsEditing(true);
    setCurrentTodoId(id);
    todoInput.current.value = title;
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, "todo", id));
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.docid !== id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">Todo App</h1>

        <form className="flex items-center mb-6" onSubmit={addOrUpdateTodo}>
          <input 
            type="text" 
            placeholder='Enter todo' 
            ref={todoInput} 
            className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </form>

        <ol className="space-y-4">
          {todos.length > 0 ? (
            todos.map((item) => (
              <li key={item.docid} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">{item.title}</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => editTodo(item.docid, item.title)} 
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteTodo(item.docid)} 
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No Todos Found...</p>
          )}
        </ol>
      </div>
    </div>
  );
};

export default Home;
