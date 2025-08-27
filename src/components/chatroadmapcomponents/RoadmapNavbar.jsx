import React from 'react';
import BasicNavbar from '../BasicNavbar';
import PlatformNavbar from '../PlatformNavbar';
import { useAuth } from './useAuth.js';

export default function RoadmapNavbar({ defaultTab = "Roadmap" }) {
  const { isLoggedIn } = useAuth();

  return isLoggedIn() ? (
    <PlatformNavbar defaultTab={defaultTab} />
  ) : (
    <BasicNavbar />
  );
}