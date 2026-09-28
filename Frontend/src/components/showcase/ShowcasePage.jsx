import React, { useState } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Problem from './Problem';
import Pipeline from './Pipeline';
import CoreModules from './CoreModules';
import DashboardPreview from './DashboardPreview';
import FinancialRiskSection from './FinancialRiskSection';
import InvestmentOptimizerSection from './InvestmentOptimizerSection';
import BlockchainSection from './BlockchainSection';
import WhatIfSection from './WhatIfSection';
import TechnologyStack from './TechnologyStack';
import ResearchReferences from './ResearchReferences';
import ProjectResources from './ProjectResources';
import FutureRoadmap from './FutureRoadmap';
import JudgeModeModal from './JudgeModeModal';
import Footer from './Footer';

export default function ShowcasePage({ onLaunchPrototype, onSwitchToLegacy, onLaunchModule }) {
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState(false);

  const scrollToPipeline = () => {
    const el = document.getElementById('pipeline');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToModules = () => {
    const el = document.getElementById('modules');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080D18] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-white">
      {/* Fixed Sticky Header Navigation */}
      <Navbar
        onOpenJudgeMode={() => setIsJudgeModeOpen(true)}
        onLaunchPrototype={onLaunchPrototype}
        onSwitchToLegacy={onSwitchToLegacy}
      />

      {/* Hero Section with AURA Engine Visual */}
      <Hero
        onExploreAura={scrollToPipeline}
        onLaunchPrototype={onLaunchPrototype}
        onOpenJudgeMode={() => setIsJudgeModeOpen(true)}
      />

      {/* The Problem Section */}
      <Problem />

      {/* Core Pipeline Section: From Signals to Decisions */}
      <Pipeline />

      {/* Actually Implemented Core Intelligence Modules */}
      <CoreModules onLaunchModule={onLaunchModule} />

      {/* High-Fidelity Interactive Dashboard Preview Mockup */}
      <DashboardPreview onLaunchFullConsole={onLaunchPrototype} />

      {/* Financial Risk Quantification Deep-Dive */}
      <FinancialRiskSection onLaunchModule={onLaunchModule} />

      {/* 0/1 Knapsack Budget Optimizer Interactive Visualizer */}
      <InvestmentOptimizerSection />

      {/* Blockchain Trust Layer with Interactive Tamper Simulation */}
      <BlockchainSection />

      {/* What-If Wargame Simulator */}
      <WhatIfSection />

      {/* Production Technology Stack */}
      <TechnologyStack />

      {/* Research & References with 6 Verified Academic/Standard Links */}
      <ResearchReferences />

      {/* Project Submission Resources: GitHub, UI/UX, Live Demo */}
      <ProjectResources
        onExploreAura={scrollToModules}
        onLaunchPrototype={onLaunchPrototype}
      />

      {/* Future Roadmap: Next Evolution */}
      <FutureRoadmap />

      {/* Comprehensive Evaluator Footer & Disclaimers */}
      <Footer
        onOpenJudgeMode={() => setIsJudgeModeOpen(true)}
        onLaunchPrototype={onLaunchPrototype}
      />

      {/* 60-Second Judge Mode Walkthrough Modal */}
      <JudgeModeModal
        isOpen={isJudgeModeOpen}
        onClose={() => setIsJudgeModeOpen(false)}
        onLaunchPrototype={onLaunchPrototype}
      />
    </div>
  );
}
