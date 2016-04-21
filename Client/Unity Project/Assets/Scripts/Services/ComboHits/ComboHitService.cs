using Assets.Scripts.Extensions;
using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services.ComboHits
{
    class ComboHitService : MonoSingleton
    {
        private static Rect DEFAULT_HIT_ZONE = new Rect(-0.16f, -0.4f, 0.32f, 0.445f);
        private const int RANDOM_HIT_ZONE_COUNT = 4;
        private const string RANDOM_HIT_SEQUENCE_NAME = "Random Hit Sequence";

        private WebSocketService webSocketService;
        private ComboHitSequenceFactory comboHitSequenceFactory;

        private Dictionary<string, ComboHitSequence> hitSequences = new Dictionary<string, ComboHitSequence>();

        void Start()
        {
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(GameConfigUpdateDTO.COMMAND_NAME, GameConfigUpdateCallback, typeof(GameConfigUpdateDTO));
            webSocketService.RegisterCommand(ComboHitSequenceUpdateDTO.COMMAND_NAME, ComboHitSequenceUpdateCallback, typeof(ComboHitSequenceUpdateDTO));
            comboHitSequenceFactory = new ComboHitSequenceFactory();
            CreateRandomHitSequences();
        }

        private void GameConfigUpdateCallback(CommandDTO commandDTO)
        {
            var gameConfigUpdateParams = ((GameConfigUpdateDTO)commandDTO).command.parameters;
            UpdateHitSequences(gameConfigUpdateParams.comboHitSequences);
        }

        private void ComboHitSequenceUpdateCallback(CommandDTO commandDTO)
        {
            var comboHitSequenceUpdateParams = ((ComboHitSequenceUpdateDTO)commandDTO).command.parameters;
            UpdateHitSequences(comboHitSequenceUpdateParams.comboHitSequences);
        }

        private void UpdateHitSequences(List<ComboHitSequenceDTO> comboHitSequenceDTOs)
        {
            foreach (ComboHitSequenceDTO comboHitSequenceDTO in comboHitSequenceDTOs)
            {
                hitSequences.AddOrReplace(comboHitSequenceDTO.name, comboHitSequenceFactory.Create(comboHitSequenceDTO));
            }
        }

        private void CreateRandomHitSequences()
        {
            RandomizedComboHitSequence randomHitSequence = new RandomizedComboHitSequence(RANDOM_HIT_SEQUENCE_NAME, DEFAULT_HIT_ZONE, RANDOM_HIT_ZONE_COUNT, 20, 20, DEFAULT_HIT_ZONE);
            hitSequences.Add(RANDOM_HIT_SEQUENCE_NAME, randomHitSequence);
        }

        public List<ComboHitSequence> GetEligibleComboHitSequences(Vector2 hitPosition)
        {
            List<ComboHitSequence> eligibleComboHitSequences = new List<ComboHitSequence>();
            foreach (ComboHitSequence comboHitSequence in hitSequences.Values)
            {
                if (comboHitSequence.IsActivable(hitPosition))
                {
                    eligibleComboHitSequences.Add(comboHitSequence);
                }
            }
            return eligibleComboHitSequences;
        }
    }
}
