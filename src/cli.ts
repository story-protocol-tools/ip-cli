#!/usr/bin/env node

import { Command } from 'commander'
import { initCommand } from './commands/init'
import { createSpgCollectionCommand } from './commands/createSpgCollection'
import { registerIpCommand } from './commands/registerIp'

// Create a new Commander program
const program = new Command()

program
  .name('story-cli')
  .description('CLI to register IP on Story Protocol')
  .version('1.0.0')

// Register sub-commands
program.addCommand(initCommand)
program.addCommand(createSpgCollectionCommand)
program.addCommand(registerIpCommand)

// Parse command-line arguments
program.parse(process.argv)
