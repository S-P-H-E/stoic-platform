import AccountSettings from "@/components/AccountSettings"

export default function Settings() {
    return (
      <div className="h-screen flex flex-col p-16 px-32 lg:px-64 2xl:px-72">
        <div className="w-full h-full">
            <AccountSettings />
          </div>
      </div>
    );
  }