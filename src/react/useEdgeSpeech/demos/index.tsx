import { EdgeSpeechTTS } from '@lobehub/tts';
import { AudioPlayer, useEdgeSpeech } from '@lobehub/tts/react';
import { Icon } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Button, Input } from 'antd';
import { Volume2 } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

import { genLevaOptions } from '../../_util/leva';

const defaultText = 'Xin chào, tôi là Hoài My - Tôi là một nhân viên của công ty LobeHub';

export default () => {
  const store = useCreateStore();

  // const api: any = useControls(
  //   {
  //     serviceUrl: EDGE_SPEECH_BACKEND_URL,
  //   },
  //   { store },
  // );

  const options: any = useControls(
    {
      rate: {
        max: 2,
        min: 0,
        step: 0.1,
        value: 1,
      },
      voice: {
        options: genLevaOptions(new EdgeSpeechTTS().voiceOptions),
        value: 'vi-VN-HoaiMyNeural',
      },
    },
    { store },
  );

  const { setText, isGlobalLoading, start, stop, audio } = useEdgeSpeech(defaultText, {
    // api,
    options,
  });

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={8}>
        {isGlobalLoading ? (
          <Button block loading onClick={stop}>
            Generating...
          </Button>
        ) : (
          <Button block icon={<Icon icon={Volume2} />} onClick={start} type={'primary'}>
            Speak
          </Button>
        )}
        <Input.TextArea defaultValue={defaultText} onChange={(e) => setText(e.target.value)} />
        <AudioPlayer audio={audio} isLoading={isGlobalLoading} onLoadingStop={stop} />
      </Flexbox>
    </StoryBook>
  );
};
