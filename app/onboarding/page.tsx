"use client";

import { useActionState, useEffect, useState } from "react";
import { Button, Card, Form, Input, Label, TextField } from "@heroui/react";
import { saveName, type SaveNameState } from "@/lib/profile/actions";

const initialState: SaveNameState = { status: "idle" };

export default function OnboardingPage() {
  const [state, action, pending] = useActionState(saveName, initialState);
  const [name, setName] = useState("");

  useEffect(() => {
    if (state.status === "success") setName("");
  }, [state.status]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-full max-w-lg mx-auto">
        <Card.Header>
          <Card.Title className="text-xl font-semibold">Welcome 👋</Card.Title>
          <Card.Description>What should we call you?</Card.Description>
        </Card.Header>

        <Form action={action}>
          <Card.Content>
            <TextField name="name" type="text" isRequired onChange={setName}>
              <Label>Name</Label>
              <Input value={name} placeholder="Enter your name" />
            </TextField>

            {state.status === "error" && (
              <p className="text-red-600 text-sm mt-2">{state.message}</p>
            )}
          </Card.Content>

          <Card.Footer className="mt-4">
            <Button className="w-full bg-neutral-900" type="submit" isPending={pending}>
              Save
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
}
