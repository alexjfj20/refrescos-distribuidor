{ pkgs, ... }: {

  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_20
  ];

  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ];

  # 👇 ESTA PARTE ES LA QUE TE FALTA
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };

}