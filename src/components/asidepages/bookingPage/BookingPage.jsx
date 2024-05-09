import { Link } from "react-router-dom";

const BookingPage = () => {
  return (
    <section className="flex justify-evenly flex-col md:flex-row gap-5 items-center text-center min-h-[80vh]">
      <Link
        to={"trip"}
        className="w-1/2 max-w-[300px] rounded-lg h-[250px] p-5 flex justify-center items-center text-3xl font-bold cursor-pointer hover:scale-105 hover:tracking-wider transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-lg bg-gray-900 text-white"
      >
        Trip
      </Link>
      <Link
        to={"service"}
        className="w-1/2 max-w-[300px] rounded-lg h-[250px] p-5 flex justify-center items-center text-3xl font-bold cursor-pointer hover:scale-105 hover:tracking-wider transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-lg bg-gray-900 text-white"
      >
        Service
      </Link>
    </section>
  );
};

export default BookingPage;
