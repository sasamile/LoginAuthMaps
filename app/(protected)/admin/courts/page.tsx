"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourtList } from "../_components/CourtList";
import { CourtMap } from "../_components/court-map";
import { CourtForm } from "../_components/court-form";

export default function CourtsPage() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Mis Canchas</h2>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>

          <TabsTrigger value="add">Agregar Cancha</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Canchas</CardTitle>
            </CardHeader>
            <CardContent>
              <CourtList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nueva Cancha</CardTitle>
            </CardHeader>
            <CardContent>
              <CourtForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
