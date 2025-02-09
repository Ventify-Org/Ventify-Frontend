const Main = () => {
    return (
        <section className="flex flex-col bg-red-400">
            <nav className="bg-white flex justify-center items-center py-2">
                <img src="/logo.png" />
            </nav>
            <div className="bg-blue-400 flex gap-4">
                <div className="w-[15%] h-screen bg-green-500"></div>
                <div className="w-[85%] h-screen bg-red-400"></div>
            </div>
        </section>
    )
}

export default Main