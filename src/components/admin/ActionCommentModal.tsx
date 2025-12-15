"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ActionCommentModalProps {
  onConfirm: (comment: string) => void;
  children: React.ReactNode;
  title: string;
  description: string;
  actionName: string;
  commentLabel?: string;
  commentPlaceholder?: string;
  actionButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
}

export function ActionCommentModal({ 
  onConfirm, 
  children,
  title,
  description,
  actionName,
  commentLabel = "Comment (Optional)",
  commentPlaceholder = "Provide any relevant notes for this action...",
  actionButtonVariant = "default",
}: ActionCommentModalProps) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    onConfirm(comment);
    setOpen(false);
    setComment('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setComment('');
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">{commentLabel}</Label>
            <Textarea
              id="comment"
              placeholder={commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} variant={actionButtonVariant}>{actionName}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}