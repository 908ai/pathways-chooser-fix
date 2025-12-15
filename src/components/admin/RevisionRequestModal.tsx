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
import { AlertTriangle } from 'lucide-react';

interface RevisionRequestModalProps {
  onConfirm: (comment: string) => void;
  children: React.ReactNode;
}

export function RevisionRequestModal({ onConfirm, children }: RevisionRequestModalProps) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!comment.trim()) {
      setError('A comment is required to request a revision.');
      return;
    }
    onConfirm(comment);
    setOpen(false);
    setComment('');
    setError('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setComment('');
      setError('');
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Revision</DialogTitle>
          <DialogDescription>
            Provide comments for the user on what needs to be revised. This will be saved in the project history.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Revision Notes</Label>
            <Textarea
              id="comment"
              placeholder="e.g., 'Please upload the revised architectural drawings and update the window U-values.'"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}