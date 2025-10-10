'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useSocket } from '../../hook/useSocket';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

export default function JoinGameDialog({ open, setOpen, userId }: { open: boolean, setOpen: (open: boolean) => void, userId: string }) {
  const { socket, connected } = useSocket();

  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);
  const ref4 = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        code1: z.string().min(1, "Required"),
        code2: z.string().min(1, "Required"),
        code3: z.string().min(1, "Required"),
        code4: z.string().min(1, "Required"),
      }),
    ),
    mode: "onChange",
  });

  const reg1 = register("code1");
  const reg2 = register("code2");
  const reg3 = register("code3");
  const reg4 = register("code4");

  const router = useRouter();

  useEffect(() => {
    if (!socket) return;
    socket.on('room-joined', (data) => {
      console.log(data);
      router.push(`/room/${data}`);
    });
  }, [socket]);

  const onNext = handleSubmit((data) => {
    if (!socket || !connected) return;
    console.log(data);
    socket.emit('join-room-by-code', { code: data.code1 + data.code2 + data.code3 + data.code4, userId });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rejoindre une partie</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2 w-full justify-center items-center my-4'>
          <p>Entrez le code de la partie que vous souhaitez rejoindre</p>
          <form className="flex gap-2">
            <input
              type="text"
              maxLength={1}
              {...reg1}
              className="size-14 rounded-sm border border-blue-500 text-blue-500 flex items-center text-center"
              ref={(el) => {
                reg1.ref(el);
                ref1.current = el;
              }}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.slice(0, 1);
                if (e.currentTarget.value.length === 1) {
                  ref2.current?.focus();
                }
              }}
            />
            <input
              type="text"
              maxLength={1}
              {...reg2}
              className="size-14 rounded-sm border border-blue-500 text-blue-500 flex items-center text-center"
              ref={(el) => {
                reg2.ref(el);
                ref2.current = el;
              }}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.slice(0, 1);
                if (e.currentTarget.value.length === 1) {
                  ref3.current?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  if (ref2.current && ref2.current.value === "") {
                    ref1.current?.focus();
                    e.preventDefault();
                  }
                }
              }}
            />
            <input
              type="text"
              maxLength={1}
              {...reg3}
              className="size-14 rounded-sm border border-blue-500 text-blue-500 flex items-center text-center"
              ref={(el) => {
                reg3.ref(el);
                ref3.current = el;
              }}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.slice(0, 1);
                if (e.currentTarget.value.length === 1) {
                  ref4.current?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  if (ref3.current && ref3.current.value === "") {
                    ref2.current?.focus();
                    e.preventDefault();
                  }
                }
              }}
            />
            <input
              type="text"
              maxLength={1}
              {...reg4}
              className="size-14 rounded-sm border border-blue-500 text-blue-500 flex items-center text-center"
              ref={(el) => {
                reg4.ref(el);
                ref4.current = el;
              }}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.slice(0, 1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  if (ref4.current && ref4.current.value === "") {
                    ref3.current?.focus();
                    e.preventDefault();
                  }
                }
              }}
            />
          </form>
        {(errors.code1 || errors.code2 || errors.code3 || errors.code4) && (
          <p className="text-red-500 text-sm">Veuillez remplir tous les champs</p>
        )}
        </div>
        <DialogFooter>
          <Button type="submit" form="join-game-form" onClick={onNext}>Rejoindre</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
