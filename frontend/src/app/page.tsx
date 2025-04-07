import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Link href="/userdata" className="  bg-white p-10 text-black m-10 rounded-md"> User Data</Link> <br />
        <Link href="/usertransaction" className=" bg-white p-10 text-black m-10 rounded-md"> User Transaction</Link> <br />
        <Link href="/datashowcase" className=" bg-white p-10 text-black m-10 rounded-md"> Data Showcase</Link> <br />
</div>
    </>
  );
}
