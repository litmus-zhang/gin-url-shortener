import { useState } from "react";
import { useShortenUrlMutation, useGetUrlQuery } from "./controller/api";

function App() {
  const [url, setUrl] = useState("");
  const [clipboard, SetClipboard] = useState("Copy");
  const [shortenUrl, { data }] = useShortenUrlMutation();
  const { data: urlStats } = useGetUrlQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!url) {
        return;
      }
      const response = await shortenUrl({ url }).unwrap();
      console.log("resolved", response);
    } catch (error) {
      console.log("rejected", error);
    }
  };

  console.log(url);
  const copyURl = () => {
    navigator.clipboard.writeText(data.data);
    setTimeout(() => {
      SetClipboard("Copied");
    }, 1000);
  };
  return (
    <div className="bg-gray-800 min-h-screen">
      <header className="p-2 z-10 sticky top-0 left-0 capitalize text-center text-xl bg-green-400 bg-opacity-70">
        <h1>URL shortener</h1>
      </header>
      <main className="text-white my-10 flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col gap-2 border p-4 rounded-md border-gray-500"
        >
          <div className="flex flex-col gap-2">
            <label className="text-md">Enter a URL</label>
            <textarea
              className="bg-gray-700 text-white outline-none p-2 rounded-md"
              type="text"
              rows={4}
              cols={40}
              name={url}
              placeholder="https://www.example.com"
              onChange={(e) => setUrl(e.target.value)}
              autoComplete="on"
            />
          </div>
          <button
            type="submit"
            className="bg-green-400 text-black font-semibold  w-full p-2 rounded-md hover:bg-green-200"
          >
            Shorten
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-4 border p-4 rounded-md border-gray-500">
          <label className="text-md">Shortened URL</label>
          <div className="bg-gray-600 p-4 relative w-64 ">
            <small
              onClick={copyURl}
              className="absolute cursor-pointer right-1 top-1 p-1 bg-green-400 text-black"
            >
              {clipboard}
            </small>

            <p>{data ? data.data : "No Url"}</p>
          </div>
        </div>
        <div className="flex my-10 text-center">
          <p className="bg-green-900 p-4 rounded">
            <p className="text-3xl font-extrabold">
              {urlStats ? urlStats.Total : "0"}
            </p>
            <small>URLs</small>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
