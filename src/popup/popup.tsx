import {Button, FocusStyleManager, Position, Toaster} from '@blueprintjs/core';
import React, {useEffect, useState} from 'react';
import {render} from 'react-dom';

import {
  createTab,
  getCurrentTab,
  sendToCurrentAwsConsoleTab,
} from '../common/browser';
import {openOptions, sendMessage} from '../common/browser/runtime';
import {AWSIcon} from '../common/components';
import {useColorScheme} from '../common/hooks';
import {Popup} from './components/Popup';

FocusStyleManager.onlyShowFocusOnTabs();

const executeSwitch = async (configItem: AWSConfigItem) => {
  return sendToCurrentAwsConsoleTab({...configItem, type: 'switch'})
    .then(window.close)
    .catch(() => {
      Notification.show({
        message: 'Active tab is not an AWS console',
        intent: 'danger',
        timeout: 2000,
        icon: 'warning-sign',
      });
    });
};

const Notification = Toaster.create({
  position: Position.BOTTOM,
  maxToasts: 1,
});

const App = () => {
  const [roles, setRoles] = useState<AWSConfig>([]);
  const theme = useColorScheme();

  useEffect(() => {
    getCurrentTab().then((tab) => {
      sendMessage<AWSConfig>({type: 'getConfig', url: tab.url ?? ''}).then(
        setRoles,
      );
    });
  }, []);

  // Create tab with appropriate AWS console URL
  const onCreateTab = async () => {
    const tab = await getCurrentTab();
    let consoleUrl = 'https://console.aws.amazon.com/console';
    
    // Check if we're currently on a China region AWS console
    if (tab.url && tab.url.includes('.amazonaws.cn')) {
      consoleUrl = 'https://console.amazonaws.cn/console';
    }
    
    createTab(consoleUrl, true, window.close);
  };

  return (
    <div className={`bp5-${theme}`}>
      <Popup
        executeSwitch={executeSwitch}
        roles={roles}
        headerRight={
          <>
            <Button
              icon={<AWSIcon />}
              variant="minimal"
              onClick={onCreateTab}
            />
            <Button
              icon="wrench"
              variant="minimal"
              onClick={() => openOptions(window.close)}
            />
          </>
        }
      />
    </div>
  );
};

render(<App />, document.getElementById('root') as HTMLDivElement);