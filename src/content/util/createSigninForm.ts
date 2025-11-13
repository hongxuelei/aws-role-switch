import {mapToSwitchForm} from '../../common/mappers';

export const createSigninForm = (configItem: AWSConfigItem, csrf: string) => {
  const redirect_uri = location.href;
  const params = mapToSwitchForm(configItem, {csrf, redirect_uri});

  // create switch role form
  const form = document.createElement('form');
  form.style.display = 'none';
  form.setAttribute('method', 'POST');
  
  // Determine the correct signin URL based on the current page
  let actionUrl = 'https://signin.aws.amazon.com/switchrole';
  if (redirect_uri.includes('.amazonaws.cn')) {
    actionUrl = 'https://signin.amazonaws.cn/switchrole';
  }
  
  form.setAttribute('action', actionUrl);
  for (const key in params) {
    const value = params[key as keyof SwitchRoleForm];
    if (value) {
      const input = document.createElement('input');
      input.setAttribute('name', key);
      input.setAttribute('value', value);
      form.appendChild(input);
    }
  }
  return form;
};

export default (params: Record<string, string>) => {
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  
  // Determine the correct signin URL based on the current page
  const currentUrl = window.location.href;
  let actionUrl = 'https://signin.aws.amazon.com/switchrole';
  if (currentUrl.includes('.amazonaws.cn')) {
    actionUrl = 'https://signin.amazonaws.cn/switchrole';
  }
  
  form.setAttribute('action', actionUrl);
  form.setAttribute('target', '_top');
  form.setAttribute('style', 'display: none;');

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', key);
    input.setAttribute('value', value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};