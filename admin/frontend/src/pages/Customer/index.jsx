import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Customer() {
  const translate = useLanguage();
  const entity = 'client';
  const searchConfig = {
    displayLabels: ['name', 'address', 'country'], 
    searchFields: 'name,address,country', 
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('Khách Hàng'),
    DATATABLE_TITLE: translate('Danh Sách Khách Hàng'),
    ADD_NEW_ENTITY: translate('Thêm Khách Hàng Mới'),
    ENTITY_NAME: translate('Khách Hàng'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
  };
  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} />}
      config={config}
    />
  );
}