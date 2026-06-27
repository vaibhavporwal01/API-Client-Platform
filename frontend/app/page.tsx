import { redirect } from 'next/navigation';

/**
 * Root page — immediately redirect to the workspace.
 */
export default function RootPage() {
  redirect('/workspace');
}
