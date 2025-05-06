import React from "react";
import { Button } from "@/components/ui/button";

const LogoutModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            No
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
