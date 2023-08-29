import AccountSettings from "@/components/AccountSettings"

export default function Settings() {
    return (
      <div className="h-screen flex flex-col sm:ml-[15.3rem] p-4 lg:p-8">
        <div className="w-full h-full">
            <AccountSettings />
          </div>
      </div>
    );
  }