"use client";
import { ReactNode } from "react";
import { FormProvider as Form, UseFormReturn } from "react-hook-form";

type FormProps = {
  children: ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: VoidFunction;
};

export default function FormProvider({
  children,
  methods,
  onSubmit,
}: FormProps) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}
