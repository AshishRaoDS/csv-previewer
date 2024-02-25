import Image from "next/image";
import CSVTable from "./components/CSVTable";

export default function Home() {
  return (
    <>
    <div className="h-[80px] flex navigationBar">
      <h2 className="text-center text-[20px] m-auto text-[26px] font-[600]">Let's take a peak into your csv</h2>
    </div>
    <CSVTable />
    </>
  );
}
