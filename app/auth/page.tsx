"use client";

import { useState, useActionState, useEffect } from "react";
import { Button, Card, Form, Input, Label, TextField, Modal, InputOTP } from "@heroui/react";
import { sendEmail, type SendEmailState, login } from "@/lib/auth/actions";
import { CheckCircle, XCircle } from "lucide-react";

const initialState: SendEmailState = { status: "idle" };

export default function AuthPage() {
    const [state, formAction, isPending] = useActionState(sendEmail, initialState);
    const [loginState, loginAction, isSubmitting] = useActionState(login, null);
    const [showToast, setShowToast] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (state.status === "success" || state.status === "error") {
            setShowToast(true);

            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [state]);

    const showOTPCard = state.status === "success";

    const toastTitle =
        state.status === "success" ? state.message :
            state.status === "error" ? state.message :
                "";

    return (
        <>
            <div className="flex-1 flex items-center justify-center">
                {!showOTPCard ? (
                    <Card className="w-full max-w-lg mx-auto">
                        <Card.Header>
                            <Card.Title className="text-xl font-semibold">Login to StudyFlow</Card.Title>
                        </Card.Header>
                        <Form action={formAction}>
                            <Card.Content>
                                <TextField>
                                    <Label>Email</Label>
                                    <Input 
                                    name="email"
                                    type="email"
                                    value={email}
                                    placeholder="Enter your email" 
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)} />
                                </TextField>
                            </Card.Content>
                            <Card.Footer className="mt-4">
                                <Button isPending={isPending} className="w-full bg-neutral-900" type="submit">
                                    {isPending ? "Sending..." : "Send OTP"}
                                </Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                ) : (
                    <Card className="w-full max-w-lg mx-auto">
                        <Card.Header className="mx-auto">
                            <Card.Title className="text-xl font-semibold">Login to StudyFlow</Card.Title>
                            <Card.Description>Enter the 6-digit code sent to your email</Card.Description>
                        </Card.Header>
                        <Form action={loginAction}>
                            <Card.Content>
                                <input type="hidden" name="email" value={email} />
                                <input type="hidden" name="otp" value={value} />

                                <InputOTP className="mx-auto" isInvalid={!!error} maxLength={6} value={value} onChange={(val) => { setValue(val); setError("") }}>
                                    <InputOTP.Group>
                                        <InputOTP.Slot index={0} />
                                        <InputOTP.Slot index={1} />
                                        <InputOTP.Slot index={2} />
                                        <InputOTP.Slot index={3} />
                                        <InputOTP.Slot index={4} />
                                        <InputOTP.Slot index={5} />
                                    </InputOTP.Group>
                                </InputOTP>
                                <span className="field-error" data-visible={!!error} id="code-error">{error}</span>
                            </Card.Content>
                            <Card.Footer className="mt-4">
                                <Button className="w-full" isDisabled={value.length !== 6} isPending={isSubmitting} type="submit">
                                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                                </Button>
                            </Card.Footer>
                        </Form>
                    </Card>
                )}
            </div>
            <Modal isOpen={showToast} onOpenChange={setShowToast} >
                <Modal.Backdrop variant="transparent">
                    <Modal.Container placement="top" size="xs">
                        <Modal.Dialog>
                            <Modal.Body>
                                <div className={`${state.status === "success" ? "text-green-500" : state.status === "error" ? "text-red-500" : "text-neutral-900"} flex items-center gap-2`}>
                                    {state.status === "success" ? <CheckCircle size={20} className="inline mr-2" /> : state.status === "error" ? <XCircle size={20} className="inline mr-2" /> : null}
                                    {toastTitle}
                                </div>
                            </Modal.Body>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>
        </>
    )
}