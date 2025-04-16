import React from "react";

const UserTypeSelection = ({ onSelectUserType }) => {
  return (
    <section className="bg-midnight text-white py-20 px-4 sm:px-8 md:px-16 lg:px-32 min-h-screen flex flex-col justify-center items-center">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-red-500 mb-6 text-glow">
          Safety First
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-xl">
          Explore crime incidents in Chicago based on your status
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <button
          onClick={() => onSelectUserType("student")}
          className="flex-1 bg-blue-900 hover:bg-blue-800 border-2 border-blue-600 text-white py-16 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold mb-2">I am a Student</h2>
            <p className="text-gray-300">View campus-related incidents</p>
          </div>
        </button>
        
        <button
          onClick={() => onSelectUserType("tourist")}
          className="flex-1 bg-green-900 hover:bg-green-800 border-2 border-green-600 text-white py-16 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">🧳</div>
            <h2 className="text-2xl font-bold mb-2">I am a Tourist</h2>
            <p className="text-gray-300">View tourism-related incidents</p>
          </div>
        </button>
      </div>
    </section>
  );
};

export default UserTypeSelection; 