import { useFormik } from 'formik';

export default function BookForm({ initialValues, onSubmit, editing, onCancel }) {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
      <input
        name="title"
        placeholder="Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        required
      />
      <input
        name="author"
        placeholder="Author"
        value={formik.values.author}
        onChange={formik.handleChange}
        required
      />
      <input
        name="publication_year"
        type="number"
        placeholder="Year"
        value={formik.values.publication_year}
        onChange={formik.handleChange}
        required
      />
      <input
        name="publisher"
        placeholder="Publisher"
        value={formik.values.publisher}
        onChange={formik.handleChange}
        required
      />
      <input
        name="image_url"
        placeholder="Image URL"
        value={formik.values.image_url}
        onChange={formik.handleChange}
        required
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          name="available"
          type="checkbox"
          checked={formik.values.available}
          onChange={formik.handleChange}
        />
        Available
      </label>
      <button type="submit">{editing ? 'Update' : 'Add'} Book</button>
      {editing && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}