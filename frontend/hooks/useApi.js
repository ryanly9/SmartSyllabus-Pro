'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentAPI, uploadAPI, quizAPI, resultAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/api';

// ─── Content Hooks ────────────────────────────────────────────────────────────
export function useContent(params) {
  return useQuery({
    queryKey: ['content', params],
    queryFn: () => contentAPI.getAll(params).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useContentById(id) {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => contentAPI.getById(id).then(r => r.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => contentAPI.delete(id),
    onSuccess: () => {
      toast.success('Content deleted');
      qc.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

// ─── Upload + AI Hooks ────────────────────────────────────────────────────────
export function useUploadPDF() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => uploadAPI.uploadPDF(formData).then(r => r.data),
    onSuccess: () => {
      toast.success('PDF uploaded successfully!');
      qc.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

export function useGenerateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => uploadAPI.generateContent(data).then(r => r.data),
    onSuccess: () => {
      toast.success('AI content generated!');
      qc.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

// ─── Quiz Hooks ───────────────────────────────────────────────────────────────
export function useQuizById(id) {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizAPI.getQuizById(id).then(r => r.data),
    enabled: !!id,
  });
}

export function useSubmitQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => quizAPI.submitQuiz(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['results'] });
      qc.invalidateQueries({ queryKey: ['quiz'] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
}

// ─── Result Hooks ─────────────────────────────────────────────────────────────
export function useResults(params) {
  return useQuery({
    queryKey: ['results', params],
    queryFn: () => resultAPI.getResults(params).then(r => r.data),
    staleTime: 2 * 60 * 1000,
  });
}
