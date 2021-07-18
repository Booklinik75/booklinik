const Category = () => {
  return (
    <div className="flex bg-white rounded-lg border border-black border-opacity-10 shadow transition hover:cursor-pointer hover:shadow-md hover:border-opacity-20 hover:bg-gray-50">
      <div
        style={{
          backgroundImage: `url("https://via.placeholder.com/1000")`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          width: "33%",
        }}
        className="mr-6 rounded-l-lg"
      ></div>
      <div className="py-8 px-0 lg:px-2">
        <p className="font-bold text-lg">Catégorie</p>
      </div>
    </div>
  );
};

export default Category;
