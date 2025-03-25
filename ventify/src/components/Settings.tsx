const Settings = () => {
  return (
    <div className="flex flex-col w-[80%] mx-auto items-center my-10 py-10 shadow-lg">
      <p className="text-3xl pb-5">Settings</p>

      <div className="bg-green-500 rounded-full w-40 h-40 mx-auto">
        <img src="../src/assets/resize.png" alt="profile pic" />
      </div>

      <div className="w-[100%] gap-4 flex flex-col mt-8 px-8">
        <div className="flex w-[70%] items-center gap-4">
          <label className="w-32 text-left">Name</label>
          <input
            className="w-full px-3 py-2 rounded-md border-black border-1"
            placeholder="Racai Group of Firms"
            disabled
          />
        </div>

        <div className="flex w-[70%] items-center gap-4">
          <label className="w-32 text-left">Username</label>
          <input
            className="w-full px-3 py-2 rounded-md border-black border-1"
            placeholder="Racai"
            disabled
          />
        </div>

        <div className="flex w-[70%] items-center gap-4">
          <label className="w-32 text-left">Email</label>
          <input
            className="w-full px-3 py-2 rounded-md border-black border-1"
            placeholder="helloemail@gmail.com"
            disabled
          />
        </div>

        <div className="flex w-[70%] items-center gap-4">
          <label className="w-32 text-left">Phone</label>
          <input
            className="w-full px-3 py-2 rounded-md border-black border-1"
            placeholder="08123456789"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
