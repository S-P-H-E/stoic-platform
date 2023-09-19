import AccountSettings from "@/components/Settings/AccountSettings"

export default function Settings() {
    return (
      <div className="h-screen flex flex-col p-8 lg:px-64 2xl:px-72">
        <div className="w-full h-full">
            <AccountSettings />
          </div>
      </div>
    );
  }