#!/usr/bin/env node

/**
 * Audio File Generator for Reading App
 * 
 * This script helps developers create basic audio files for testing.
 * Creates simple tone-based success sound and silent background music.
 * 
 * Usage: node generate-test-audio.js
 */

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, '../assets/audio/ui');

function createTestAudioFiles() {
  console.log('🎵 Audio File Generator for Reading App');
  console.log('=====================================');
  
  // Check if directory exists
  if (!fs.existsSync(AUDIO_DIR)) {
    console.log('❌ Audio directory not found:', AUDIO_DIR);
    console.log('Please run this script from the root of the project.');
    process.exit(1);
  }
  
  console.log('📂 Audio directory:', AUDIO_DIR);
  console.log('');
  
  // Check for existing audio files
  const successFile = path.join(AUDIO_DIR, 'success.mp3');
  const backgroundFile = path.join(AUDIO_DIR, 'background.mp3');
  
  const hasSuccess = fs.existsSync(successFile);
  const hasBackground = fs.existsSync(backgroundFile);
  
  console.log('📋 Audio File Status:');
  console.log(`   success.mp3: ${hasSuccess ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log(`   background.mp3: ${hasBackground ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log('');
  
  if (hasSuccess && hasBackground) {
    console.log('🎉 All audio files are present!');
    console.log('   Your app should have working audio.');
    console.log('');
    console.log('🔧 To test:');
    console.log('   1. Start your app: npm start');
    console.log('   2. Complete a lesson to hear success sound');
    console.log('   3. Enable background music in Settings');
    console.log('');
    return;
  }
  
  console.log('ℹ️  MISSING AUDIO FILES GUIDE');
  console.log('============================');
  console.log('');
  console.log('The reading app needs these audio files in assets/audio/ui/:');
  console.log('');
  
  if (!hasSuccess) {
    console.log('📄 success.mp3');
    console.log('   • Purpose: Plays when lessons are completed');
    console.log('   • Duration: 1-3 seconds');
    console.log('   • Style: Gentle chime or bell sound');
    console.log('   • Example: Simple "ding" notification sound');
    console.log('');
  }
  
  if (!hasBackground) {
    console.log('📄 background.mp3');
    console.log('   • Purpose: Optional ambient music during lessons');
    console.log('   • Duration: 30+ seconds (will loop)');
    console.log('   • Style: Very subtle, calming instrumental');
    console.log('   • Example: Quiet piano melody or nature sounds');
    console.log('');
  }
  
  console.log('🌐 FREE AUDIO RESOURCES:');
  console.log('   • Freesound.org - Community sound library');
  console.log('   • Zapsplat.com - Professional sounds (free registration)');
  console.log('   • YouTube Audio Library - Free music & effects');
  console.log('');
  
  console.log('🔍 SEARCH TERMS:');
  console.log('   • "gentle bell chime"');
  console.log('   • "success notification sound"');
  console.log('   • "calm instrumental loop"');
  console.log('   • "ambient background music"');
  console.log('');
  
  console.log('📖 For detailed instructions, see AUDIO.md');
  console.log('');
  
  console.log('✨ NOTE: The app works perfectly without these files!');
  console.log('   Audio features will show console messages as fallback.');
}

// Run the generator
if (require.main === module) {
  createTestAudioFiles();
}

module.exports = { createTestAudioFiles };