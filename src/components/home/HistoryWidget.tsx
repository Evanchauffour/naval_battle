'use client'


import { Gamepad2 } from "lucide-react";
import Widget from "./Widget";

export default function HistoryWidget({ className }: { className?: string }) {

  return (
    <Widget title="Historique" description="Historique de mes parties récentes" icon={<Gamepad2 className="w-5 h-5" />} className={className}>
      <div>
        <p>Aucune partie trouvée</p>
      </div>
    </Widget>
  )
}

