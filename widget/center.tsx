import { Variable, GLib } from "astal";

export default function Center() {
  return (
    <box className="Center">
      <Clock />
    </box>
  );
}

function Clock({ format = "%d-%m-%y %H:%M" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <label className="Time" onDestroy={() => time.drop()} label={time()} />
  );
}
